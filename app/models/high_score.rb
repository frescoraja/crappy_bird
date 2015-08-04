class HighScore < ActiveRecord::Base
  validates :name, :score, presence: true
  validates :name, length: { minimum: 1, maximum: 12 }
  default_scope -> { order(score: :desc) }

  def score
    read_attribute(:score).to_s.rjust(4, '0')
  end
end
