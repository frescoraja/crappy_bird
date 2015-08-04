Rails.application.routes.draw do
  root to: "static_pages#root"
  resources :high_scores, only: [:create, :index]
end
