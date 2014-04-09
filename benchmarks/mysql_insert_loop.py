#/usr/bin/env python

import time,mysql.connector

for i in xrange(50):
	conn = mysql.connector.connect(host= "localhost",
                  user="root",
                  passwd="admin",
                  db="node_test")
	try:
		x = conn.cursor()
   		x.execute("INSERT INTO example (data) VALUES (%s)" % time.time())
   		conn.commit()
		conn.close()
		print "element inserted"
	except:
   		print "errorrrrrrrrrrrrrr"
