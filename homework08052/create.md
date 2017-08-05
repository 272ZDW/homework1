## 常用sqli语句

#### 1.创建数据库

第一步 判断当前数据库系统中是否存在要新建的数据库 如果存在就要删除

`if exits(select*from sysdatabases where name='databasesName')drop databases databasesName`

第二步 创建数据库

     create databases databasesName
    
    ON
    
         （
    
               name ='databases_data',--表示数据库的逻辑名
    
               filename ='路径/databases_data.mdf',--表示数据库的物理文件名
    
              size =XXmb,--表示数据库的初始大小
    
               maxsize=xxmb,--表示数据库的最大大小
    
               filegrowth=xx--表示文件的增长速度（可以是百分数也可以是好多mb
    
           ）
    
    log on
    
        (
    
               name ='databases_log,--表示数据库的逻辑名
    
               filename ='路径/databases_log.ldf,--表示数据库的物理文件名
    
              size =XXmb,--表示数据库的初始大小
    
               maxsize=xxmb,--表示数据库的最大大小
    
               filegrowth=xx--表示文件的增长速度（可以是百分数也可以是好多mb
    
        )

    

#### 2.创建表

1.定义基本语句

     USE 数据库名 CREATE TABLE 表名 (列名 类型(大小) DEFAULT'默认值',
    
                                    列名 类型(大小) DEFAULT'默认值',  
    
                                    列名 类型(大小) DEFAULT'默认值',
    
                                    ... ...);
       默认值可以不写 可以省略
       
       例:CREATE TABLE S (SNO char(2), SNAME char(8), AGE decimal(2), SEX char(2) DEFAULT'男', DEPT char(2));
    
              创建了一个五列的表，其中第四列的默认值为‘男’。
#### 3.查询表

一 简单查询语句

1.查看表结构

`SQL>DESC emp;`

2.查询所有列

`SQL>SELECT * FROM emp;`

3.查询指定列

`SQL>SELECT empmo, ename, mgr FROM emp;`

`SQL>SELECT DISTINCT mgr FROM emp; 只显示结果不同的项`

4.查询指定行

`SQL>SELECT * FROM emp WHERE job='CLERK';`

5.使用算术表达式

    SQL>SELECT ename, sal*13+nvl(comm,0)  FROM emp; 
    
    nvl(comm,1)的意思是，如果comm中有值，则nvl(comm,1)=comm; comm中无值，则nvl(comm,1)=0。
    
    SQL>SELECT ename, sal*13+nvl(comm,0) year_sal FROM emp; （year_sal为别名，可按别名排序）
    
    SQL>SELECT * FROM emp WHERE hiredate>'01-1月-82';
 6.使用like操作符(%,_)

`%表示一个或多个字符，_表示一个字符，[charlist]表示字符列中的任何单一字符，[^charlist]或者[!charlist]不在字符列中的任何单一字符。`

7.在where条件中使用In

`SQL>SELECT * FROM emp WHERE job IN ('CLERK','ANALYST');`

8.查询字段内容为空/非空的语句

`SQL>SELECT * FROM emp WHERE mgr IS/IS NOT NULL; `

9.使用逻辑操作符号

`SQL>SELECT * FROM emp WHERE (sal>500 or job='MANAGE') and ename like 'J%';`

10.将查询结果按字段的值进行排序

`SQL>SELECT * FROM emp ORDER BY deptno, sal DESC; (按部门升序，并按薪酬降序)`

二 复杂查询

1.数据分组

`SQL>SELECT MAX(sal),MIN(age),AVG(sal),SUM(sal) from emp;`

`SQL>SELECT * FROM emp where sal=(SELECT MAX(sal) from emp));`

`SQL>SELEC COUNT(*) FROM emp;`

2.group by (用于查询结果的分组统计) 和 having子句(用于限制分组显示结果)

`SQL>SELECT deptno,MAX(sal),AVG(sal) FROM emp GROUP BY deptno;`

`SQL>SELECT deptno, job, AVG(sal),MIN(sal) FROM emp group by deptno,job having AVG(sal)<2000;`

`对于数据分组的总结：`

`a. 分组函数只能出现在选择列表、having、order by子句中（不能出现在where中）`

`b. 如果select语句中同时包含有group by, having, order by，那么它们的顺序是group by, having, order by。`

`c. 在选择列中如果有列、表达式和分组函数，那么这些列和表达式必须出现在group by子句中，否则就是会出错。`

3.多表查询

`SQL>SELECT e.name,e.sal,d.dname FROM emp e, dept d WHERE e.deptno=d.deptno order by d.deptno;`

`SQL>SELECT e.ename,e.sal,s.grade FROM emp e,salgrade s WHER e.sal BETWEEN s.losal AND s.hisal;`

4.自连接

`SQL>SELECT er.ename, ee.ename mgr_name from emp er, emp ee where er.mgr=ee.empno;`

5.子查询（嵌入到其他sql语句中的select语句，也叫嵌套查询）

5.1单行子查询

`SQL>SELECT ename FROM emp WHERE deptno=(SELECT deptno FROM emp where ename='SMITH');查询表中与smith同部门的人员名字。因为返回结果只有一行，所以用“=”连接子查询语句`

5.2多行子查询

`SQL>SELECT ename,job,sal,deptno from emp WHERE job IN (SELECT DISTINCT job FROM emp WHERE deptno=10);查询表中与部门号为10的工作相同的员工的姓名、工作、薪水、部门号。因为返回结果有多行，所以用“IN”连接子查询语句。`

5.3使用ALL

`SQL>SELECT ename,sal,deptno FROM emp WHERE sal> ALL (SELECT sal FROM emp WHERE deptno=30);或SQL>SELECT ename,sal,deptno FROM emp WHERE sal> (SELECT MAX(sal) FROM emp WHERE deptno=30);查询工资比部门号为30号的所有员工工资都高的员工的姓名、薪水和部门号。以上两个语句在功能上是一样的，但执行效率上，函数会高 得多。`

5.4使用ANY

`SQL>SELECT ename,sal,deptno FROM emp WHERE sal> ANY (SELECT sal FROM emp WHERE deptno=30);或SQL>SELECT ename,sal,deptno FROM emp WHERE sal> (SELECT MIN(sal) FROM emp WHERE deptno=30);查询工资比部门号为30号的任意一个员工工资高（只要比某一员工工资高即可）的员工的姓名、薪水和部门号。以上两个语句在功能上是 一样的，但执行效率上，函数会高得多。`

5.5多列子查询

`SQL>SELECT * FROM emp WHERE (job, deptno)=(SELECT job, deptno FROM emp WHERE ename='SMITH');`

5.6在from子句汇中使用子查询

`SQL>SELECT emp.deptno,emp.ename,emp.sal,t_avgsal.avgsal FROM emp,(SELECT emp.deptno,avg(emp.sal) avgsal FROM emp GROUP BY emp.deptno) t_avgsal where emp.deptno=t_avgsal.deptno AND emp.sal>t_avgsal.avgsal ORDER BY emp.deptno;`

5.7分页查询

数据库的每行数据都有一个对应的行号，称为rownum.

SQL>SELECT a2.* FROM (SELECT a1.*, ROWNUM rn FROM (SELECT * FROM emp ORDER BY sal) a1 WHERE ROWNUM<=10) a2 WHERE rn>=6;

指定查询列、查询结果排序等，都只需要修改最里层的子查询即可

5.8用查询结果创建新表

`SQL>CREATE TABLE mytable (id,name,sal,job,deptno) AS SELECT empno,ename,sal,job,deptno FROM emp;`

5.9合并查询

`SQL>SELECT ename, sal, job FROM emp WHERE sal>2500 UNION(INTERSECT/UNION ALL/MINUS) SELECT ename, sal, job FROM emp WHERE job='MANAGER';`

5.10使用子查询插入数据

SQL>CREATE TABLE myEmp(empID number(4), name varchar2(20), sal number(6), job varchar2(10), dept number(2)); 先建一张空表；

`SQL>INSERT INTO myEmp(empID, name, sal, job, dept) SELECT empno, ename, sal, job, deptno FROM emp WHERE deptno=10; 再将emp表中部门号为10的数据插入到新表myEmp中，实现数据的批量查询。`

5.11实用查询更新表中的数据

`SQL>UPDATE emp SET(job, sal, comm)=(SELECT job, sal, comm FROM emp where ename='SMITH') WHERE ename='SCOTT';`

#### 4.表中插入数据

`insert into tablename (first_column,...last_column) values (first_value,...last_value);  `

例 `insert into employee (firstname, lastname, age, address, city) `

`values (‘Li’, ‘Ming’, 45, ‘No.77 Changan Road’, ‘Beijing”); `

#### 5.表中删除数据

`DELETE* DELETE FROM 表名 WHERE 条件* 删除表中所有数据 但是不删除表`格* `DELETE FROM user;`

`删除user表中 id 等于1的那条数据,同时满足两个条件使用关键字 AND连``接,DELETE FROM user WHERE id = 1`

#### 6.修改数据

```
不添加条件 改变整张表中所有对应字段的值
UPDATE 表名 SET 字段1 = 值2 字段2 = 值2,...... WHERE 条件
UPDATE user SET name = "何文静",age = 20 WHERE id = 1
```

#### 7.删除表

`Drop table [表名]`

