import libcst

## Notes:
# 1. The format of the output is a list of dictionaries. Each dictionary contains the following keys:
#   - class_name: The name of the class that the function is in. If the function is not in a class, the value is "No class".
#   - func_name: The name of the function.
#   - line_number: The line number of the function definition.
#   - source: The source code of the function definition.


class SimpleCST(libcst.CSTVisitor):
    METADATA_DEPENDENCIES = (
        libcst.metadata.PositionProvider,
        libcst.metadata.ParentNodeProvider,
    )

    def __init__(self):
        self.func_list = []
        self.module = None

    def set_module(self, module):
        self.module = module

    def reset_func_name(self):
        self.func_list = []

    def _get_line_number(self, node):
        return self.get_metadata(libcst.metadata.PositionProvider, node).start.line

    def _get_class_name(self, node):
        parent_node = self.get_metadata(libcst.metadata.ParentNodeProvider, node)

        while isinstance(parent_node, libcst.ClassDef) is False:
            if isinstance(parent_node, libcst.Module):
                return "No class"
            parent_node = self.get_metadata(
                libcst.metadata.ParentNodeProvider, parent_node
            )

        return parent_node.name.value

    def visit_FunctionDef(self, node: libcst.FunctionDef):
        if isinstance(node, libcst.FunctionDef):
            class_name = self._get_class_name(node)
            source = self.module.code_for_node(node)

            self.func_list.append(
                {
                    "class_name": str(class_name),
                    "func_name": str(node.name.value),
                    "line_number": str(self._get_line_number(node)),
                    "source": str(source),
                }
            )


if __name__ == "__main__":
    with open("/home/foneme/Desktop/codesearch/backend/main.py", "r") as f:
        module = libcst.parse_module(f.read())

    simple_cst = SimpleCST()
    simple_cst.set_module(module)
    wrapper = libcst.metadata.MetadataWrapper(module)
    result = wrapper.visit(simple_cst)
    print(simple_cst.func_list)
