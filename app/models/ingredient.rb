class Ingredient < ActiveRecord::Base
  validates :inci_name, presence: true, uniqueness: { case_sensitive: false }

  has_many :quantities#, order(quantities.position)
  has_many :articles, through: :quantities

  searchable do
    text :inci_name, :boost => 2.0
    text :formula
    text :cas_number
    text :ec_number
    text :articles do
      articles.map { |article| article.name }
    end
    string :inci_name, :stored => true
    string :formula, :stored => true
    string :cas_number, :stored => true
    string :ec_number, :stored => true
    string :articles, :multiple => true, :stored => true do
      articles.map { |article| article.name }
    end
    double :molecular_weight, :stored => true
    time :created_at
    time :updated_at
  end
end
