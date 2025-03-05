```java
    public  List<drill>  readGeoVertices(String src)  {

        List<drill> drills = new ArrayList<>();
        File file = new File(src);
        try{
//           System.out.println(src);
            Workbook book = readExcelAb(src);
            Sheet sheet = book.getSheetAt(0);    //
            int rows = sheet.getLastRowNum();    //得到该sheet的行数
//           System.out.println(rows);
            Row row = sheet.getRow(0);
            Cell cell1 = row.getCell(0);    //表示获取第i行第1列的单元格
            for (int i = 2; i <= rows; i++) {
                drill d= new  drill();

                row = sheet.getRow(i);
                if(row==null)
                    break;
//                if(row.getLastCellNum()<4)
//                    break;
                cell1 = row.getCell(0);    //表示获取第i行第1列的单元格
                if(cell1==null)
                    break;
                cell1 = row.getCell(1);    //表示获取第i行第2列的单元格
                d.name = cell1.getStringCellValue();
                cell1 = row.getCell(2);    //表示获取第i行第3列的单元格
                 d.x = cell1.getNumericCellValue();
                cell1 = row.getCell(3);     //表示获取第i行第4列的单元格
                d.y = cell1.getNumericCellValue();
                cell1 = row.getCell(4);     //表示获取第i行第5列的单元格
                d.z = cell1.getNumericCellValue();
                for(int m=5;m<29;m++){
                    int index=m-6;
                    cell1 = row.getCell(m);
                    d.layerTopValue.add(cell1.getNumericCellValue()/100);

                }

                //int tindex = Vertices.size()+5000;
                 d.x = (d.x-4090000)/100;
                 d.y = (d.y-38530000)/100;
                 d.z = d.z/100;
                 drills.add(d);

//                if(z==-1)
//                    continue;
//                if(z==0.0)
//                    z = -3.3;

            }

            book.close();
        }catch (Exception e) {
            e.printStackTrace();

        }


        return drills;
    }
```

