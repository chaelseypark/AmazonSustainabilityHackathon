from flask import Flask, request, jsonify
from flask_cors import CORS
from marshmallow import Schema, fields, ValidationError, validate
# from model import 

app = Flask(__name__)
CORS(app)

class LocationSchema(Schema):
    latitude = fields.Float(validate=validate.Range(min=-90.0, max=90.0))
    longitude = fields.Float(validate=validate.Range(min=-180.0, max=180.0))

class DataSchema(Schema):
    location = fields.Nested(LocationSchema, required=True)
    years_ahead = fields.Int(validate=validate.Range(min=0, max=None))


@app.route('/api/calculations/severity', methods=['POST'])
def get_severity():
    """
    POST /api/calculations/severity
    Receives JSON with location coordinates (latitude and longitude).
    
    Request JSON format:
    {
        "years_ahead": int,
        "location": {
            "latitude": float, 
            "longitude": float   
        }
    }
    
    Returns:
    - 200 OK: JSON with latitude, longitude, and calculated severity.
    - 400 Bad Request: If input validation fails.
    - 500 Internal Server Error: For unexpected errors.
    """
    
    try:
        schema = DataSchema()
        data = request.get_json()
        validated_data = schema.load(data) 
        
        lat = validated_data["location"]["latitude"]
        lon = validated_data["location"]["longitude"]
        years = validated_data["years_ahead"]
        
        # severity = calculate_severity(lat, lon, years) 
        severity = 0.1
        
        return jsonify({
            "severity": severity
        }), 200

    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
    except Exception as e:
        return jsonify({"error": "Server error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
