# django_formset_helper

#### Example:
https://youtu.be/gKa_lm9waAo

# Purpose:
The app was meant to make it easy to use formsets in the django template, by using a single templatetag.
The goal is to make it easy for everyone to deal with formsets in the template within a single line.

# Reason:
After having alot of trouble with formsets lack of JS to deal with templates I decided to create this app. It's still pretty raw, with no test coverage at all, but should be easier to debug and use than creating the JS for each formset by yourself.

# It Needs Contribution:
Please, feel free to contribute with issues, pull requests and everything.
Its been tested with django 1.6+ and python 2.7.9.

# How it Works:
The templatetag invokes an html template in case you need to change it to suit your needs.
The app should handle rendering the form and a table. After clicking the Add button, the javascript will add the form fields to the table and clean up the form for re-use. Should also works for editing forms. It also includes an Action column with Edit and Delete buttons.

# To install:
pip install -e git://github.com/henryfentanes/django-formset-helper.git#egg=django-formset-helper

# How to Use:
The easiest way to use the formset helper is by using django-extra-views (https://github.com/AndrewIngram/django-extra-views) and django-bootstrap-form (https://github.com/tzangms/django-bootstrap-form). After setting up those two, you should be able to call the templatetag like this:

{% load formset_helper %}
{% inline_fieldset inline=inlines.0 exclude="'MainModel','Id', 'Delete'" required="field_one,field_two" %}

and Voilá!

