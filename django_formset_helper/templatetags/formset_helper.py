# coding:utf-8
import json
from django import template

register = template.Library()


# Html template that can be overwritten to suit your needs
@register.inclusion_tag('django_formset_helper/fieldset_inline_template.html')
def inline_fieldset(inline, prefix=None, exclude=[], required=[]):
    form_name = inline.prefix
    form = inline.form(prefix=prefix)
    table_header = []
    for field in inline.empty_form:
        if field.label not in exclude:
            table_header.append(field.label)

    required = required.split(',')
    for i in required:
        if prefix:
            required[required.index(i)] = '#id_' + prefix + '-' + i
        else:
            required[required.index(i)] = '#id_' + i
    required = json.dumps(required)

    return {"table_header": table_header,
            "form_name": form_name, "inline": inline,
            "form_create": form,
            "exclude": exclude,
            "required": required,
            "form_prefix": prefix}


# To show fields choice display
@register.filter
def selected_choice(form, field):
    is_choice_field = '_choices' in form.fields[field].__dict__
    if is_choice_field and form.initial:
        return dict(form.fields[field].choices)[form.initial[field]]
    elif form.initial:
        return form.initial[field]
    else:
        return ''
