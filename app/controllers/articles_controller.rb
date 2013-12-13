class ArticlesController < ApplicationController

  # ensure admin for other actions
  before_filter :check_admin_logged_in!, :except => [:show, :index, :search]

# ensure user or admin logged in for these actions (:only option is optional)
  before_filter :check_user_logged_in!, :only => [:show, :index, :search]

  def index
    #@articles = Article.all
    #@search = Article.search do
     # fulltext params[:search]
      #with(:published_at).less_than(Time.zone.now)
      #facet(:name)
      #with(:publish_month, params[:month]) if params[:month].present?
    #end
    # @articles = @search.results





    if params[:search].present?
      @articles = Article.search do
        keywords(params[:query])
      end
      #@ingredients = @articles.ingredients
    else
      @articles = Article.order("created_at DESC")

      #@ingredients = Ingredient.find_all
      #@ingredients = @articles.find(1).ingredients
    end



      #@search = Sunspot.search(Guideline) do
      # fulltext params[:search]
      #end

      #@guidelines = @search.results
    #else
     # @guidelines = Guideline.order(:title).all
    #end

    #respond_to do |format|
    #  format.html # index.html.erb
    #  format.json { render json: @articles }
    #end
    respond_to do |format|
      format.html
      format.atom { render :layout => false }

      # we want the RSS feed to redirect permanently to the ATOM feed
      format.rss { redirect_to feed_path(:format => :atom), :status => :moved_permanently }
    end
  end

  def search
    @search = Article.search do
      keywords params[:search], :highlight => true
		with(:created_at).less_than Time.now
		with(:updated_at).less_than Time.now
		order_by(:updated_at, :desc)
		paginate(:page => params[:page], :per_page => 15)
		facet(:manufacturer, :ingredients)
		with(:manufacturer, params[:manufacturer]) if params[:manufacturer].present?
		with(:ingredients, params[:ingredients]) if params[:ingredients].present?
    end



    #@ingredients = @articles.ingredients

    #@search = Article.search do
    #  keywords(params[:query])
    #end
    #@articles = @search.results

    respond_to do |format|
      format.html
      format.atom { render :layout => false }

      # we want the RSS feed to redirect permanently to the ATOM feed
      format.rss { redirect_to feed_path(:format => :atom), :status => :moved_permanently }
    end

  end


  def feed
    # this will be the name of the feed displayed on the feed reader
    @name = "FEED articletitle"

    # the news items
    @articles = Article.order("updated_at desc")

    # this will be our Feed's update timestamp
    @updated = @articles.first.updated_at unless @articles.empty?

    respond_to do |format|
      format.atom { render :layout => false }

      # we want the RSS feed to redirect permanently to the ATOM feed
      format.rss { redirect_to feed_path(:format => :atom), :status => :moved_permanently }
    end
  end

  def edit
    if (admin_signed_in?)

      @article = Article.find(params[:id])
    else
       redirect_to article_path
    end


  end

  def update
    @article = Article.find(params[:id])

    if @article.update(params.require(:article).permit(:name, :manufacturer, :image, quantities_attributes: [:id, :article_id, :ingredient_id, :position, :_destroy]))
      redirect_to @article
    else
      render 'edit'
    end
  end



  def show
    @article = Article.find(params[:id])
    @ingredients = @article.ingredients

    #Quantity.find_by_ingredient_id(ingredient.id)

    #@quantities = @article.quantities AND Quantity.find_by_ingredient_id(ingredient.id)
    respond_to do |format|
      format.html
      format.atom { render :layout => false }

      # we want the RSS feed to redirect permanently to the ATOM feed
      format.rss { redirect_to feed_path(:format => :atom), :status => :moved_permanently }
    end

  end


  def new
    if(admin_signed_in?)
      @article = Article.new
      3.times do
        # quantity = @article.quantities.build.build_ingredient
        quantitiy = @article.quantities.build
        # quantity = @article.quantities.build
        # 4.times { @article.answers.build }
      end
    else
      redirect_to articles_path
    end

  end

  def create
    # params.require(:project).permit(:name, tasks_attributes: [:id, :name, :_destroy])
    @article = Article.new(params.require(:article).permit(:name, :manufacturer, :image, quantities_attributes: [:id, :article_id, :ingredient_id, :position, :_destroy]))
    #@article = Article.new(params[:article])
    #@article = Article.new(params[:article])
    if @article.save
      flash[:notice] = "Successfully created article."
      redirect_to @article
    else
      render :action => 'new'
    end
  end

  def destroy
    if(admin_signed_in?)
      @article = Article.find(params[:id])
      @article.destroy
      flash[:notice] = "Successfully destroyed article."
      redirect_to articles_url

    else
      redirect_to articles_path
    end
  end

  private
  def check_admin_logged_in! # admin must be logged in
    authenticate_admin!
  end
  def check_user_logged_in! # if admin is not logged in, user must be logged in
    if !admin_signed_in?
      authenticate_user!
    end
  end


end
