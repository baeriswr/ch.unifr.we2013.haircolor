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
    else
      @articles = Article.all
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





  end

  def search
    @articles = Article.search do
      keywords(params[:query])
    end





    #redirect_to
  end

  def show
    @article = Article.find(params[:id])
  end


end
