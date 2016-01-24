# 计算共需要多少条边 毕设用

def bsum(arr):
	print arr
	bb = [ v*arr[((k+1)%len(arr))] for k,v in enumerate( arr ) ]
	del bb[-1]
	print sum(bb)

def arrange(arr):
	arr.sort()
	b=[]
	ind = [ -1 ] # init
	for k in range( 0, len(arr) ):
		plusminus = (-1)**((k*(k+1))/2)
		amount = k**(k%2)
		index = ind[len(ind)-1] + plusminus*amount
		print index,
		ind.append( index )



		pos = k*(0**(k%2))  # k, 0, k, 0, ...( R, L, R, L, ... )
		print pos
		b.insert( pos , arr[index] )
	print ind
	return b

# a = [8,7,4,3,1,2,5,6]
# bsum(a)

a = [1,5,3,8,4,2]
# bsum(a)

# a = range(1,14)
bsum(arrange(a))
