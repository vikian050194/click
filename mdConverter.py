import markdown


PLACEHOLDER = "{{content}}"

def md_to_html(name: str, start_from_line: int):
    source = f"{name.upper()}.md"
    template_path = f"src/{name}/template.html"
    output_path = f"src/{name}/{name}.html"

    with open(template_path, "r") as f:
        template = f.read()

    with open(source, "r") as f:
        sourceMd= f.readlines()

    sourceMd = sourceMd[start_from_line:]
    sourceMd = "\n".join(sourceMd)
    htmlContent = markdown.markdown(sourceMd)

    with open(output_path, "w") as f:
        result = template.replace(PLACEHOLDER, htmlContent)
        f.write(result)

files = [
    ("changelog", 9)
]

for name, start in files:
    md_to_html(name, start)