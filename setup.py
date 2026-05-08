from setuptools import setup, find_packages

with open("requirements.txt") as f:
    install_requires = f.read().strip().split("\n")

setup(
    name="wo_wip",
    version="1.0.0",
    description="Works Order WIP operator screen",
    author="NestERP / Manifold SA",
    author_email="",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires,
)
