from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import bcrypt
import smtplib
import secrets
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__)
CORS(app)

# ✅ Database Connection
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='shg@#10@A1#bop1#',
        database='empdata_db'
    )

# ✅ Default Route
@app.route('/')
def hello_world():
    return 'Hello, World!'

# ✅ Fetch Users
@app.route('/get-user')
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM empdata_db.emptable;")
    emptable = cursor.fetchall()
    cursor.execute("SELECT * FROM empdata_db.empdata;")
    empdata = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({"emptable": emptable, "empdata": empdata}), 200

# ✅ Signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (Name, Email, Password) VALUES (%s, %s, %s)", (name, email, hashed_pw))
        conn.commit()
        return jsonify({"message": "✅ User created!"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"message": f"❌ Error: {str(e)}"}), 400
    finally:
        cursor.close()
        conn.close()

# ✅ Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE Email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user['Password'].encode('utf-8')):
        return jsonify({
            "message": "✅ Login successful!",
            "user": {"id": user['ID'], "name": user['Name'], "email": user['Email']}
        }), 200
    else:
        return jsonify({"message": "❌ Invalid email or password"}), 401

# ✅ Forgot Password
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE Email=%s", (email,))
    user = cursor.fetchone()

    if not user:
        cursor.close()
        conn.close()
        return jsonify({"message": "❌ No account found with this email"}), 404

    # Generate reset token
    token = secrets.token_urlsafe(32)

    # Save token in DB
    cursor.execute("UPDATE users SET reset_token=%s WHERE Email=%s", (token, email))
    conn.commit()
    cursor.close()
    conn.close()

    # Send email
    send_reset_email(email, token)
    return jsonify({"message": "✅ Password reset link sent to your email"}), 200

# ✅ Check token validity (GET when clicking link)
@app.route('/reset-password/<token>', methods=['GET'])
def validate_token(token):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE reset_token=%s", (token,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return jsonify({"valid": True, "message": "Token is valid"}), 200
    else:
        return jsonify({"valid": False, "message": "Invalid or expired token"}), 400

# ✅ Reset password (POST)
@app.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    new_password = data.get('new_password')

    if not new_password:
        return jsonify({"message": "❌ Password required"}), 400

    hashed_pw = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET Password=%s, reset_token=NULL WHERE reset_token=%s", (hashed_pw, token))
    conn.commit()

    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        return jsonify({"message": "❌ Invalid or expired token"}), 400

    cursor.close()
    conn.close()
    return jsonify({"message": "✅ Password updated successfully"}), 200

# ✅ Email Sending
def send_reset_email(to_email, token):
    sender = "quicksportmoments@gmail.com"
    password = "tlts gwlq tiry priw"  # App password
    reset_link = f"http://localhost:5173/reset-password/{token}"
  # Your React frontend

    html = f"""
    <html>
    <body style="font-family: Arial; background-color: #f9f9f9; padding: 30px;">
        <table width="600" style="margin:auto; background:white; border-radius:10px;">
            <tr style="background-color:#007bff; color:white;">
                <td style="padding:20px; text-align:center; font-size:22px;">Password Reset Request</td>
            </tr>
            <tr>
                <td style="padding:30px; color:#333;">
                    <p>Hello,</p>
                    <p>We received a request to reset your password. Click below to reset it:</p>
                    <p style="text-align:center;">
                        <a href="{reset_link}" style="background:#007bff; color:white; padding:12px 25px; border-radius:5px; text-decoration:none;">Reset Password</a>
                    </p>
                    <p>If you didn’t request this, ignore this email.</p>
                    <p style="margin-top:30px;">Thanks,<br><b>Support Team</b></p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Password Reset Request"
    msg["From"] = sender
    msg["To"] = to_email
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender, password)
            server.sendmail(sender, to_email, msg.as_string())
        print(f"✅ Reset email sent to {to_email}")
    except Exception as e:
        print("❌ Error sending email:", e)

# ✅ Run
if __name__ == '__main__':
    app.run(debug=True)
