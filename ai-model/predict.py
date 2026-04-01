import sys
import json
import joblib
import pandas as pd
import os

# ✅ Load model safely (absolute path)
current_dir = os.path.dirname(__file__)
model_path = os.path.join(current_dir, "model.pkl")
model = joblib.load(model_path)

# ✅ Get input
input_data = json.loads(sys.argv[1])

# ✅ Feature order (VERY IMPORTANT)
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

# ✅ Convert to DataFrame
df = pd.DataFrame([input_data])[features]

# ✅ Predict
prediction = model.predict(df)[0]

# ✅ Print ONLY 0 or 1
print(int(prediction))