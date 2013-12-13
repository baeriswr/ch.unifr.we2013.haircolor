##
# This class represents a hair color article. A hair color article has a name,
# manufacturer and ingredients. An article has a many to many relationship with
# an Ingredient, which is represented through a Quantity.

#require 'formtastic'

class Article < ActiveRecord::Base
  validates :manufacturer, presence: true
  validates :name, presence: true, length: { maximum: 70 }, uniqueness: { case_sensitive: false }

  has_many :quantities
  has_many :ingredients, through: :quantities

  #accepts_nested_attributes_for :ingredients
  accepts_nested_attributes_for :quantities
  
  searchable do
    text :name, :boost => 2.0
    text :manufacturer
	 text :ingredients do
		ingredients.map { |ingredient| ingredient.inci_name }
	 end
	 string :name, :stored => true
	 string :manufacturer, :stored => true
	 string :ingredients, :multiple => true, :stored => true do
	   ingredients.map { |ingredient| ingredient.inci_name }
	 end
    time :created_at
    time :updated_at
  end
  
end
