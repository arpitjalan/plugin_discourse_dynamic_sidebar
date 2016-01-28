import DiscoveryController from 'discourse/controllers/discovery';
import DiscoveryRoute from 'discourse/routes/discovery';
import CategoryList from "discourse/models/category-list";

export default {
  name: "accepted-answers-cache",
  initialize() {

    CategoryList.reopenClass({
      list(store) {
        const getCategories = () => Discourse.ajax("/categories.json");
        return PreloadStore.getAndRemove("categories_list", getCategories).then(result => {
          return CategoryList.create({
            categories: this.categoriesFrom(store, result),
            can_create_category: result.category_list.can_create_category,
            can_create_topic: result.category_list.can_create_topic,
            draft_key: result.category_list.draft_key,
            draft: result.category_list.draft,
            draft_sequence: result.category_list.draft_sequence,
            solved_answers: result.category_list.solved_answers
          });
        });
      }
    });

    DiscoveryRoute.reopen({
      model() {
        return CategoryList.list(this.store).then(list => { return list; })
      }
    })

    DiscoveryController.reopen({
      solved_answer: function() {
        let solved_answers = this.get('model.solved_answers');
        let solved_answers_html = "";

        $.each(solved_answers, function( index, value ) {
          solved_answers_html += "<li>"
          solved_answers_html += "<span>"+ value['username'] +"</span>"
          solved_answers_html += "<span>"+ value['category_name'] +"</span>"
          solved_answers_html += "<span>"+ value['title'] +"</span>"
          solved_answers_html += "<span>"+ value['post_created_at'] +"</span>"
          solved_answers_html += "</li>"
        });
        return solved_answers_html;
      }.property()
    });
  }
};
