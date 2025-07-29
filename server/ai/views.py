
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.conf import settings
from home.models import Coaches
import google.generativeai as genai

@csrf_exempt
def aichat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            message = data.get('message')

            if not message:
                return JsonResponse({'error': 'Message is required'}, status=400)

            database_data = [
                {
                    "name": c.name,
                    "email": c.email,
                    "domain": c.domain,
                    "experience": c.experience,
                    "location": c.location,
                }
                for c in Coaches.objects.all()[:5]
            ]

            full_prompt = (
                f"You are a helpful assistant. A user asked: \"{message}\".\n\n"
                f"Here is some coach data:\n{json.dumps(database_data, indent=2)}\n\n"
                f"Please answer the user's question or suggest relevant coaches."
                f"please not reavel any sensitive and normal content of database"
            )

            # Initialize Gemini client
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('models/gemini-1.5-flash')

            response = model.generate_content(full_prompt)

            return JsonResponse({'message': response.text})

        except Exception as e:
            print(e)
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'message': 'Method not allowed'}, status=405)








# from django.shortcuts import render
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# import json
# import openai
# from django.conf import settings
# from openai import OpenAI
# from home.models import Coaches
# @csrf_exempt
# def aichat(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             # print(openai.api_key+'openai.api_key')
#             message = data.get('message')
#             if not message:
#                 return JsonResponse({'error': 'Message is required'}, status=400)

#             # Serialize the queryset into a list of dicts
#             database_data = [
#                 {
#                     "name": c.name,
#                     "email": c.email,
#                     "domain": c.domain,
#                     "experience": c.experience,
#                     "location": c.location,
#                 }
#                 for c in Coaches.objects.all()[:5]
#             ]

#             # Prompt to OpenAI
#             full_prompt = (
#                 f"You are a helpful assistant. A user asked: \"{message}\".\n\n"
#                 f"Here is some coach data:\n{json.dumps(database_data, indent=2)}\n\n"
#                 f"Please answer the user's question or suggest relevant coaches."
#             )
#             # print(full_prompt)
#             client = OpenAI(api_key=settings.OPENAI_API_KEY)
#             print(client)
#             response = client.chat.completions.create(                
#                 model="gpt-3.5-turbo",
#                 messages=[
#                     {"role": "user", "content": full_prompt}
#                 ]
#             )

#             ai_response = response.choices[0].message.content
#             return JsonResponse({'response': ai_response})

#         except Exception as e:
#             print(e)
#             return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({'message': 'Method not allowed'}, status=405)
