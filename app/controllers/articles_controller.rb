class ArticlesController < ApplicationController



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
		facet(:manufacturer)
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
    @article = Article.find(params[:id])
  end

  def update
    @article = Ingredient.find(params[:id])

    if @article.update(params[:post])
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
    @article = Article.new
    3.times do
      # quantity = @article.quantities.build.build_ingredient
      quantitiy = @article.quantities.build
      # quantity = @article.quantities.build
      # 4.times { @article.answers.build }
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
    @article = Article.find(params[:id])
    @article.destroy
    flash[:notice] = "Successfully destroyed article."
    redirect_to articles_url
  end

=begin
    def new
      @article = Article.new
      @quantity = Quantity.new
    end
 =end

=begin
  def create
    @article = Article.new(params[:article].permit(:name, :manufacturer, :image))
    @article.save
    # @quantity = @article.quantities.build(params[:quantities].permit(:article_id, :ingredient_id, :position))
    @quantity = Quantity.new(params[:quantities].permit(:article_id, :ingredient_id, :position))

    redirect_to @article
  end
=end



end
