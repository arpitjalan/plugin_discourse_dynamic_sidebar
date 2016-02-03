# name: plugin_discourse_sidebar
# about: adds a dynamic sidebar on the right of the pages
# authors: Vairix, Arpit Jalan

register_asset "javascripts/admin/templates/site_settings/setting_text.hbs"
register_asset "javascripts/discourse/templates/discovery.hbs"
register_asset "stylesheets/sidebar_styles.css"

after_initialize do
  require_dependency 'category_list_serializer'

  class ::CategoryListSerializer
    attributes :solved_answers

    def solved_answers
      Rails.cache.fetch("latest_solved_answers", expires_in: 1.minute) do
        solved_answers = {}
        custom_field = TopicCustomField.includes(:topic)
                                 .joins("INNER JOIN topics ON topics.id = topic_custom_fields.topic_id")
                                 .joins("INNER JOIN categories ON (categories.id = topics.category_id AND categories.read_restricted = false AND categories.suppress_from_homepage = false)")
                                 .joins("INNER JOIN posts ON posts.id = topic_custom_fields.value::int8")
                                 .joins("INNER JOIN users ON users.id = posts.user_id")
                                 .select('topic_custom_fields.*, posts.id post_id, posts.created_at post_created_at, users.username username, users.id user_id, topics.title topic_title, categories.name category_name')
                                 .where(name: 'accepted_answer_post_id')
                                 .order("topic_custom_fields.created_at DESC")
                                 .limit(5)

        custom_field.each_with_index do |field, index|
          user = User.find_by_id(field.user_id)
          solved_answers[index] = {username: field.username, user_avatar: user.avatar_template_url.gsub("{size}", "25"), topic_title: field.topic_title, topic_url: field.topic.url, category_name: field.category_name, post_created_at: field.post_created_at, solution_marked_at: field.created_at}
        end
        solved_answers
      end
    end
  end
end
