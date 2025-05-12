Rails.application.routes.draw do
  resources :users, only: [] do
    collection do
      post 'signup'
      post 'login'
    end
  end

  resources :items, only: [:create, :update, :destroy, :index]
  
  resources :orders, only: [:create, :index, :show, :update] do
    member do
      post :complete
      post :cancel
    end
  end
end
