import hashlib, bcrypt, sys

password = sys.argv[1]
pre_hashed = hashlib.sha256(password.encode("utf-8")).hexdigest()
hashed = bcrypt.hashpw(pre_hashed.encode(), bcrypt.gensalt(rounds=12))
print(hashed.decode())  