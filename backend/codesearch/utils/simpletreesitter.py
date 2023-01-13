from tree_sitter import Language, Parser

## Notes:
# 1.) We are only encoding function definitions


class SimpleTreeSitter(object):
    def __init__(self):
        self.func_list = []
        self.module = None

        # Tree Sitter
        _ = Language.build_library(
            "codesearch/utils/treesitter/build/my-languages.so",
            [
                "codesearch/utils/treesitter/tree-sitter-go",
                "codesearch/utils/treesitter/tree-sitter-javascript",
                "codesearch/utils/treesitter/tree-sitter-python",
            ],
        )

        self.GO_LANGUAGE = Language(
            "codesearch/utils/treesitter/build/my-languages.so", "go"
        )
        self.JS_LANGUAGE = Language(
            "codesearch/utils/treesitter/build/my-languages.so", "javascript"
        )
        self.PY_LANGUAGE = Language(
            "codesearch/utils/treesitter/build/my-languages.so", "python"
        )

    def set_module(self, path):
        with open(path) as f:
            source_code = f.read()

        self.module = self.parser.parse(bytes(source_code, "utf-8"))

    def set_language(self, lang):
        self.lang = lang
        self.parser = Parser()

        if lang == "go":
            self.parser.set_language(self.GO_LANGUAGE)
        elif lang == "javascript":
            self.parser.set_language(self.JS_LANGUAGE)
        elif lang == "python":
            self.parser.set_language(self.PY_LANGUAGE)

    def reset_func_name(self):
        self.func_list = []

    def _get_class_name(self, node):
        parent_node = node.parent

        # Python
        if self.lang == "python":
            if parent_node.type == "module":
                return "No Class"
            elif parent_node.type == "class_definition":
                return parent_node.child_by_field_name("name").text.decode("utf-8")
        # Javascript
        elif self.lang == "javascript":
            if parent_node.type == "program":
                return "No Class"
            elif parent_node.type == "class_declaration":
                return parent_node.child_by_field_name("name").text.decode("utf-8")

        return self._get_class_name(node=parent_node)

    def _get_source_code(self, node):
        # assert (
        #     node.type == "function_definition"
        # ), """Node type must be "function_definition" """

        start_row, start_column = node.start_point
        end_row, end_column = node.end_point

        source_code = self.module.text.decode("utf-8")
        lines = source_code.split("\n")

        node_source_code_lines = lines[start_row : end_row + 1]
        node_source_code_lines[0] = node_source_code_lines[0][start_column:]
        node_source_code_lines[-1] = node_source_code_lines[-1][:end_column]

        node_source_code = "\n".join(node_source_code_lines)

        return node_source_code

    def traverse_tree(self, node):
        # Javascript: Ignoring a statement block, as it branches into the function definition
        if node.type == "statement_block" and self.lang == "javascript":
            return

        # Python
        if self.lang == "python":
            if node.type == "function_definition":
                class_name = self._get_class_name(node=node)
                func_name = node.child_by_field_name("name").text.decode("utf-8")
                source_code = self._get_source_code(node=node)

                self.func_list.append(
                    {
                        "class_name": class_name,
                        "func_name": func_name,
                        "line_number": node.start_point[0] + 1,
                        "source": source_code,
                    }
                )
        # Javascript
        elif self.lang == "javascript":
            if node.type == "function_declaration" or node.type == "method_definition":
                class_name = self._get_class_name(node=node)
                func_name = node.child_by_field_name("name").text.decode("utf-8")
                source_code = self._get_source_code(node=node)

                self.func_list.append(
                    {
                        "class_name": class_name,
                        "func_name": func_name,
                        "line_number": node.start_point[0] + 1,
                        "source": source_code,
                    }
                )
            # Javascript
            elif node.type == "expression_statement":
                class_name = self._get_class_name(node=node)
                # func_name = node.child_by_field_name("name").text.decode("utf-8")
                source_code = self._get_source_code(node=node)

                self.func_list.append(
                    {
                        "class_name": class_name,
                        "func_name": "Anonymous",
                        "line_number": node.start_point[0] + 1,
                        "source": source_code,
                    }
                )

        children = node.children
        for child in children:
            self.traverse_tree(child)


if __name__ == "__main__":
    sts = SimpleTreeSitter()
    # sts.set_language("python")
    # sts.set_module(path="/home/foneme/Desktop/codesearch/temp_proj/temp.py")
    # sts.traverse_tree(sts.module.root_node)

    # print(sts.func_list)

    sts.set_language("javascript")
    sts.set_module(path="/home/foneme/Desktop/codesearch/temp_proj/temp.js")
    sts.traverse_tree(sts.module.root_node)

    print(sts.func_list)
