class Ingredient < ActiveRecord::Base
  #has_many :quantities
  #has_many :articles, through: :quantities

  searchable do
    text :inci_name
    text :formula
  end


end
