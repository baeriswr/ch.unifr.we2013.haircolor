class PostsController < ApplicationController
  def new
  end


  def show
    @post = Post.find(params[:id])
  end


  def create
    @post = Post.new(params[:post])
    @post.save
    redirect_to @post
  end

  def search
    @search = Post.search(:include => [:comments]) do
      keywords(params[:q])
    end
  end

  private
  def post_params
    params.require(:post).permit(:title, :text)
  end
end