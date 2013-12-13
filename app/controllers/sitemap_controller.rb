class SitemapController < ApplicationController
  def index
    @articles = Article.all
    @ingredients = Ingredient.all
    
    respond_to do |format|
      format.html
      format.xml { render :xml => @artricles }
    end
  end
end
