import DiscoveryController from 'discourse/controllers/discovery';
import DiscoveryRoute from 'discourse/routes/discovery';
import CategoryList from "discourse/models/category-list";
import PreloadStore from 'preload-store';

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
        return CategoryList.list(this.store);
      }
    });

    DiscoveryController.reopen({
      solved_answer: function() {
        const solved_answers = this.get('model.solved_answers');
        let solved_answers_html = "";

        $.each(solved_answers, (index, value) => {
          solved_answers_html += `<div class='solution_row'>
              <span class='user_avatar'><img src='${value['user_avatar']}'></span>
              <span class='title'><a href='${value['topic_url']}'>${value['topic_title']}</a></span>
            </div>`;
        });

        return solved_answers_html;
      }.property()
    });
  }
};
