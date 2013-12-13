DeviseExample::Application.routes.draw do

  devise_for :users, :admins

  get '/token' => 'home#token', as: :token
  get '/search' => 'articles#search'
  get '/about' => 'home#about'
  get '/contact' => 'home#contact'
  get '/help' => 'home#help'

  resources :home, only: :index
  resources :admins, only: :index
  resources :users

  resources :articles do
    collection do
       get 'search'
    end
  end

  resources :ingredients do
    collection do
      get 'search'
    end
  end



  #match '/feed' => 'articles#feed',
  get '/feed' => 'articles#feed',
        :as => :feed,
        :defaults => { :format => 'atom' }

  resources :trades
  get '/sitemap.xml' => 'sitemap#index',
      :defaults => { :format => 'xml' }


  root 'home#index'
end
