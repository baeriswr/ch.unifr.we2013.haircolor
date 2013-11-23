DeviseExample::Application.routes.draw do

  devise_for :users, :admins

  get '/token' => 'home#token', as: :token


  resources :home, only: :index
  resources :admins, only: :index
  resources :products
  resources :posts

  root 'home#index'

end
