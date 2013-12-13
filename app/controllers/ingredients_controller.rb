class IngredientsController < ApplicationController
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
      @ingredients = Ingredient.search do
        keywords(params[:query])
      end
      #@articles = @ingredients.articles
    else
      #@ingredients = Ingredient.order(@ingredient.Quantity.position)
      @ingredients = Ingredient.all
      #@articles = @ingredients.articles
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
    @search = Ingredient.search do
      keywords params[:search], :highlight => true
      with(:created_at).less_than Time.now
      with(:updated_at).less_than Time.now
      order_by(:updated_at, :desc)
      paginate(:page => params[:page], :per_page => 15)
      facet(:articles)
      with(:articles, params[:articles]) if params[:articles].present?
    end

    #@articles = @ingredients.articles


    respond_to do |format|
      format.html
      format.atom { render :layout => false }

      # we want the RSS feed to redirect permanently to the ATOM feed
      format.rss { redirect_to feed_path(:format => :atom), :status => :moved_permanently }
    end

  end


  def show
	 @ingredient = Ingredient.find(params[:id])
   @articles = @ingredient.articles
   @quantities = @ingredient.quantities
   respond_to do |format|
     format.html
     format.atom { render :layout => false }

     # we want the RSS feed to redirect permanently to the ATOM feed
     format.rss { redirect_to feed_path(:format => :atom), :status => :moved_permanently }
   end


  end

  def new
    if(admin_signed_in?)
      @ingredient = Ingredient.new

    else
      redirect_to articles_path
    end

  end

  def create
    # params.require(:project).permit(:name, tasks_attributes: [:id, :name, :_destroy])
    @ingredient = Ingredient.new(params.require(:ingredient).permit(:inci_name, :forumla, :structure, :cas_number, :ec_number, :molecular_weight))
    #@article = Article.new(params[:article])
    #@article = Article.new(params[:article])
    if @ingredient.save
      flash[:notice] = "Successfully created ingredient."
      redirect_to @ingredient
    else
      render :action => 'new'
    end
  end

  def destroy
    if(admin_signed_in?)
      @ingredient = Ingredient.find(params[:id])
      @ingredient.destroy
      flash[:notice] = "Successfully destroyed ingredient."
      redirect_to ingredients_url
    else
      redirect_to ingredients_path
    end
  end

  def edit
    if (admin_signed_in?)

      @ingredient = Ingredient.find(params[:id])
    else
      redirect_to ingredient_path
    end


  end

  def update
    @ingredient = Ingredient.find(params[:id])

    if @ingredient.update(params.require(:ingredient).permit(:inci_name, :forumla, :structure, :cas_number, :ec_number, :molecular_weight))
      redirect_to @ingredient
    else
      render 'edit'
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
