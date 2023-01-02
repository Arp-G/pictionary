defmodule PictionaryWeb.Router do
  use PictionaryWeb, :router

  # pipeline :browser do
  #   plug :accepts, ["html"]
  #   plug :fetch_session
  #   plug :fetch_flash
  #   plug :protect_from_forgery
  #   plug :put_secure_browser_headers
  # end

  pipeline :current_user do
    plug PictionaryWeb.CurrentUser
  end

  pipeline :token_auth do
    plug PictionaryWeb.CurrentUser
    plug PictionaryWeb.TokenAuth
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  # Health check
  scope "/", PictionaryWeb do
    pipe_through :api

    get "/health", PageController, :health
  end

  scope "/api", PictionaryWeb do
    pipe_through [:api, :current_user]

    post "/sessions", SessionController, :create
  end

  scope "/api", PictionaryWeb do
    pipe_through [:api, :token_auth]

    patch "/users", UserController, :update
    get "/users", UserController, :show
    post "/games", GamesController, :create
    get "/games/:game_id", GamesController, :show
  end
end
