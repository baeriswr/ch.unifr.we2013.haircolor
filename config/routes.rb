DeviseExample::Application.routes.draw do

  devise_for :users, :admins

  get '/token' => 'home#token', as: :token

  #get "articles/index"
  #get "articles/show"
  #get "articles/search"




  resources :home, only: :index
  resources :admins, only: :index
  resources :products
  resources :posts
  #resources :articles
  resources :articles, :only => [ :index, :show] do
    collection do
      get 'search'
    end
  end
  resources :trades
  resources :ingredients

  root 'home#index'

end
