from django.shortcuts import render

def homepage(request):
    return render(request, 'insideout/homepage.html', {})

def crossdomain(request):
    return render(request, 'insideout/crossdomain.xml', {}, content_type="text/xml")
