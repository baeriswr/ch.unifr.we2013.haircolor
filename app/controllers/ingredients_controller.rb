class IngredientsController < ApplicationController
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
    @ingredients = Ingredient.search do
      fulltext params[:search]

      #with(:created_at).less_than Time.now
      #with(:updated_at).less_than Time.now
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
   respond_to do |format|
     format.html
     format.atom { render :layout => false }

     # we want the RSS feed to redirect permanently to the ATOM feed
     format.rss { redirect_to feed_path(:format => :atom), :status => :moved_permanently }
   end


  end


end
