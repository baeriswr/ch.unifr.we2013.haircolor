class HomeController < ApplicationController
  before_action :authenticate_user!, only: :token

  def index
	 @articles = Article.order("updated_at DESC").first(3)
	 @ingredients = Ingredient.order("updated_at DESC").first(3)
  end
  
  def about
    
  end
  
  def contact
    
  end
  
  def help
    
  end
  
  def token
  end
  
end
