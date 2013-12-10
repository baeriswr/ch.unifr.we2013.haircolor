#xml.feed do |feed|
atom_feed :language => 'en-US' do |feed|
  feed.title = "HairStyle Articles"
  feed.updated @articles.maximum(:updated_at)

  @articles.each do |article|
    #feed.entry article do |entry|
    feed.entry article do |entry|
      entry.title article.name
      #entry.content article.body
      entry.content article.manufacturer
      entry.url article_path(article)
      entry.author do |author|
        author.name "Admin"
      end
    end # end feed.entry
  end # end @articles.each
end