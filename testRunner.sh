folders=( "test/js/model")

for i in "${folders[@]}"
  do
    :
    cd $i
    echo -e "running tests on $i"
    files=(`ls *Test.js`) 
    for i in "${files[@]}"
      do
      echo -e "running tests on $i"
      mocha "$i">result
      cat result
      rm result
    done
    cd ../
done
