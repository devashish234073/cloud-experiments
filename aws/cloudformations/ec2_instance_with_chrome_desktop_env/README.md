Video showing the usage: https://www.youtube.com/watch?v=56iJ0n6Us9k

The template launches an ec2 instance with desktop environment and chrome browser installed.

It also has a apache server installed to show the progress of the setup.

Initially when you open the public IP of your instance in a browser you will see a page like :

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/27ed5b16-470c-45a5-8894-ddd33bfae73d)

Which keeps reloading itself 

And once all the applications are installed in the ec2 instance the html of the apache server changes to something like:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/63690100-ae93-4e7f-9be8-966a914d9d12)

Showing the further steps.

i.e. to first run vncserver to setup the vncpassword and then create a tunnel at localhost:5901 to securely connect to our instance.

And then connect to localhost:5901 using a vncviewer client in my case I have installed from https://www.realvnc.com/en/connect/download/viewer/
