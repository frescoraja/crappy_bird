class HighScoresController < ApplicationController
  def index
    @high_scores = HighScore.limit(10)
    render json: @high_scores
  end

  def create
    @high_score = HighScore.new(high_score_params)

    if @high_score.save
      render json: @high_score, status: :ok
    else
      render json: @high_score.errors.full_messages, status: :unprocessable_entity
    end
  end

  private
  def high_score_params
    params.require(:high_score).permit(:name, :score)
  end
end
