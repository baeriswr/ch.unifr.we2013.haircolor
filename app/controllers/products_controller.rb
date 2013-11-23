class ProductsController < ApplicationController
  require 'rubygems'
  require 'rsolr'

# Direct connection
  solr = RSolr.connect :url => 'http://localhost:8983/solr/collection1'

# Connecting over a proxy server
  #solr = RSolr.connect :url => 'http://http://localhost:8983', :proxy=>'http://user:pass@proxy.example.com:8080'


  @response

# send a request to /catalog
  #response = solr.get 'catalog', :params => {:q => '*:*'}


    def getrequest
      solr = RSolr.connect :url => 'http://localhost:8983/solr/collection1'
      @response = solr.get 'select', :params => {
          :q => 'solr',
          :wt => :json
      }

      # .. etc..
    end


    def addrequest
      solr.add([
                   { :id => 1, :name => "Hello, world", :body => "Two roads diverged in a wood..." },
                   { :id => 2, :name => "Adventurous", :body => "I shall be telling this with a sigh..." }
               ])
    end

end
