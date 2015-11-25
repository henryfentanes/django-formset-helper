from distutils.core import setup

setup(
    name='django-formset-helper',
    version='0.1',
    url='https://github.com/henryfentanes/django-formset-helper',
    install_requires=[
        'Django >= 1.6',
        'django-extra-views'],
    description='Helper templatetag to use with formsets',
    license="MIT",
    author='Henry Fentanes',
    author_email='henryfentanes@gmail.com',
    packages=['django_formset_helper'],
    package_dir={'django_formset_helper': 'django_formset_helper'},
    include_package_data=True,
    package_data={'django_formset_helper': ['*']},
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2'],
)
