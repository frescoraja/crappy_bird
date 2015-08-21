class StaticPagesController < ApplicationController
  def root
    @high_scores = HighScore.limit(10)
  end
end
