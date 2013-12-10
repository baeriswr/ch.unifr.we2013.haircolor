class Ingredient < ActiveRecord::Base

  #has_many :quantities
  #has_many :articles, through: :quantities

  searchable do
    text :inci_name
    text :formula
  end

  has_many :quantities#, order(quantities.position)
  has_many :articles, through: :quantities

end
