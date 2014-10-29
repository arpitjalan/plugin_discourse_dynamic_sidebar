# Discourse dynamic sidebar plugin

This plugin adds a dynamic sidebar on the right of the pages (hidden when the user is inside the topics or when the screen has less than 800px width), wrapping the main content. 

It allows add any HTML content, from twitter widgets to plain text.

## Usage

The dynamic sidebar settings is on the site Settings > Sidebar Settings.

- Activate the sidebar by checking the box "Show sidebar on the main screen"

- Add any HTML content on the box "sidebar content"

(.../admin/site_settings/category/sidebar_settings)

![](https://raw.githubusercontent.com/tcreativo/docs-images/master/scrshot1.png)

- Result:

![](https://raw.githubusercontent.com/tcreativo/docs-images/master/scrshot2.png)

## Installation

As seen in a [how-to on meta.discourse.org](https://meta.discourse.org/t/advanced-troubleshooting-with-docker/15927#Example:%20Install%20a%20plugin), simply **add the plugin's repo url to your container's app.yml file**:

```yml
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - mkdir -p plugins
          - git clone https://github.com/discourse/docker_manager.git
          - git clone https://github.com/tcreativo/plugin_discourse_dynamic_sidebar.git
```
* Rebuild the container

```
cd /var/docker
git pull
./launcher rebuild app
```



## Authors
- Produced by [Territorio creativo S.L.](http://www.territoriocreativo.es/)

- Developed by [Vairix](http://www.vairix.com/)

## Copyright / License

Copyright 2014 Territorio creativo S.L.

Licensed under the GNU General Public License Version 2.0 (or later); you may not use this work except in compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

[http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt](http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
