import sys
import json
import joblib
import pandas as pd

# Load model
model = joblib.load("../ai-model/model.pkl")

# Get input
input_data = json.loads(sys.argv[1])

# Define feature order (VERY IMPORTANT)
features = [
    'edge_followed_by',
    'edge_follow',
    'username_length',
    'username_has_number',
    'full_name_has_number',
    'full_name_length',
    'is_private',
    'is_joined_recently',
    'has_channel',
    'is_business_account',
    'has_guides',
    'has_external_url'
]

# Convert to DataFrame in correct order
df = pd.DataFrame([input_data])[features]

# Predict
prediction = model.predict(df)[0]

# Print result
print(prediction)