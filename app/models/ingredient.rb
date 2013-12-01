class Ingredient < ActiveRecord::Base
  attr_accessible :inci_name :formula :structure :cas_number :ec_number :molecular_weight
  has_many :articles
end
