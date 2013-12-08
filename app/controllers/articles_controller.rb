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
      @articles = Article.order("created_at DESC")
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
    @articles = Article.search do
      fulltext params[:search]
		
		with(:created_at).less_than Time.now
		with(:updated_at).less_than Time.now
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





  def show
    @article = Article.find(params[:id])
    respond_to do |format|
      format.html
      format.atom { render :layout => false }

      # we want the RSS feed to redirect permanently to the ATOM feed
      format.rss { redirect_to feed_path(:format => :atom), :status => :moved_permanently }
    end

  end


end
