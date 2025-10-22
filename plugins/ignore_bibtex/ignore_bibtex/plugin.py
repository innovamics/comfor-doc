from mkdocs.plugins import BasePlugin
import re

class IgnoreBibtexPlugin(BasePlugin):

    def on_page_markdown(self, markdown, page, config, files):
        def protect_code(match):
            code = match.group(0)
            return code.replace('@', '__MKDOCS_AT__')

        markdown = re.sub(r'```[\s\S]*?```', protect_code, markdown)

        markdown = re.sub(r'`.*?`', protect_code, markdown)

        return markdown

    def on_page_content(self, html, page, config, files):
        return html.replace('__MKDOCS_AT__', '@')
