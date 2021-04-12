defmodule PictionaryWeb.Router do
  use PictionaryWeb, :router

  # pipeline :browser do
  #   plug :accepts, ["html"]
  #   plug :fetch_session
  #   plug :fetch_flash
  #   plug :protect_from_forgery
  #   plug :put_secure_browser_headers
  # end

  pipeline :token_auth do
    plug PictionaryWeb.TokenAuth
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", PictionaryWeb do
    pipe_through :api

    post "/sessions", SessionController, :create
  end

  scope "/api", PictionaryWeb do
    pipe_through [:api, :token_auth]

    patch "/users", UserController, :update
    get "/users", UserController, :show
  end

  # Other scopes may use custom stacks.
  # scope "/api", PictionaryWeb do
  #   pipe_through :api
  # end
end
