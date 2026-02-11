# 小红书评论助手
帮助你更高效地阅读并节省时间

🧑 **隐藏 @ 他人的用户评论**
- 隐藏评论内容里含有 @user（例如 `@AAA王哥`） 的评论，不必成为他人 play 的一环

    📵 **只隐藏无文字内容评论**
    - 只隐藏评论内容里没有文字内容的评论，例如：
    - 隐藏：`@吃瓜专家` 
    - 显示：`@吃瓜专家 哈哈哈`

    ↪️ **隐藏被 @ 人的回复**
    - 隐藏之前@到的人的进一步回复，必须双向匹配，即隐藏此处评论2：
    - 评论1：`AAA王哥| @吃瓜专家 来看` 
    - 评论2：`吃瓜专家| 回复 AAA 王哥：哈哈哈`

💬 **添加展开所有回复按钮**
- 在 `展开更多回复` 旁，添加 `查看所有` 按钮。可自定义按钮文字。
- 注意，默认一次最多展开 50 条（_展开次数_ 10），以防止服务器限流接口而不能继续查看评论。  
可通过 _展开次数_ 来自定义总展开条数，总展开条数 = _展开次数_ × 5

🚧 **开启正则表达式过滤器（滤除）**
- 使用正则表达式滤除目标评论，目标评论将被隐藏
- 正则表达式为 JS 字面量风格，见 [MDN Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions) 和 [regex101](https://regex101.com/)
- 例如，字符串 `/鱼|fish|🐟/i`
- 提交表达式成功后，表达式将会立即生效。如果表达式无效，将会提示提交失败。

#  rednote Comment Assistant
Helping you read more efficiently and save time

🧑 **Hide comments that @ other users**

- Hide comments that contain @user mentions (e.g., `@AAA王哥`). You don't have to join their game.

    📵 **Only hide comments with no text**
    - Only hide comments containing @-mentions that have no additional text content. For example:
    - Hide: `@吃瓜专家` 
    - Show: `@吃瓜专家 哈哈哈`

    ↪️ **Hide replies to @-mentions**
    - Hide subsequent replies from users who were previously @-mentioned. This requires a two-direction match. For example, hide Comment 2 here:
    - Comment 1: `AAA王哥| @吃瓜专家 来看`
    - Comment 2: `吃瓜专家| 回复 AAA 王哥：哈哈哈`

💬 **Add a button to expand all replies**

- Add a `查看所有` button next to the existing `展开更多回复` button. You can customize the button text.

- Note: By default, a maximum of 50 comments are expanded at a time (_Comment Expansions_ 10) to prevent server rate-limiting, which could block further requests to view comments.  
You can customize the number of comments to expand by adjusting the _Comment Expansions_, where number_of_comments = _Comment Expansions_ × 5.

🚧 **Enable regex filter (filter out)**

- Use a regular expression to filter out and hide target comments.

- The regular expression must be in JS literal style. See [MDN Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions) and [regex101](https://regex101.com/).

- Example string: `/鱼|fish|🐟/i`

- After submitted successfully, the expression will take effect immediately. If the expression is invalid, there will be a failure message.
