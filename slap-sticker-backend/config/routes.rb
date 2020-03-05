Rails.application.routes.draw do
  resources :purchases
  resources :users
  resources :images
  get '/users/stickers/:id', to: 'users#stickers'

  mount ActionCable.server => '/cable'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
