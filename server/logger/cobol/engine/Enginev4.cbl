      ******************************************************************
      * Engine Test v4 - Log Testing Version
      ******************************************************************
         IDENTIFICATION DIVISION.
      ******************************************************************
         PROGRAM-ID.                 ENGINEV4TST.
         AUTHOR.                     DEV.
         DATE-WRITTEN.              2024-05-05.

      ******************************************************************
         ENVIRONMENT DIVISION.
      ******************************************************************
         CONFIGURATION SECTION.
         SPECIAL-NAMES.
            DECIMAL-POINT IS COMMA.

      ******************************************************************
         DATA DIVISION.
      ******************************************************************
         WORKING-STORAGE SECTION.
         
         EXEC SQL BEGIN DECLARE SECTION END-EXEC.
         01  DBNAME                  PIC X(30) VALUE SPACE.
         01  USERNAME                PIC X(30) VALUE SPACE.
         01  PASSWD                  PIC X(10) VALUE SPACE.
         
      *  Estrutura para dados do log
         01  WS-LOG-DATA.
             05 WS-SESSION-ID        PIC X(10).
             05 WS-COMPONENT         PIC X(10).
             05 WS-ACTION            PIC X(20).
             05 WS-STATUS            PIC X(10).
             05 WS-RESPONSE-TIME     PIC 9(6).
             05 WS-MESSAGE           PIC X(100).
             05 WS-ENDPOINT          PIC X(50).
             05 WS-METHOD            PIC X(6).
             05 WS-VALUE             PIC 9(10)V99.
         
      *  Variaveis editadas para formatacao
         01  WS-EDITED-RESPONSE     PIC Z(6) VALUE SPACES.
         01  WS-EDITED-VALUE        PIC Z(10)9,99 VALUE SPACES.
         
      *  Variaveis normalizadas para insert
         01  WS-NORM-SESSION-ID     PIC X(10).
         01  WS-NORM-COMPONENT      PIC X(10).
         01  WS-NORM-ACTION         PIC X(20).
         01  WS-NORM-STATUS         PIC X(10).
         01  WS-NORM-MESSAGE        PIC X(100).
         01  WS-NORM-ENDPOINT       PIC X(50).
         01  WS-NORM-METHOD         PIC X(6).
         
         EXEC SQL END DECLARE SECTION END-EXEC.

      *  Variáveis de trabalho
         01  WS-INPUT               PIC X(500) VALUE SPACES.
         01  WS-CMD                 PIC X(10) VALUE SPACE.
         01  WS-DB-STARTED          PIC X(1)  VALUE "N".
         01  WS-UNSTRING-PTR        PIC 9(2)  VALUE 1.
         01  WS-IDX                 PIC 9(2)  VALUE 1.
         
         EXEC SQL INCLUDE SQLCA END-EXEC.

      ******************************************************************
         PROCEDURE DIVISION.
      ******************************************************************
         MAIN-RTN.
            PERFORM WAIT-CMD.
            
         MENU-HELP.
            DISPLAY "=== COMANDOS DE TESTE DE LOG ===".
            DISPLAY "START : Inicia conexao com o banco".
            DISPLAY "LOG   : Insere log (formato:)".
            DISPLAY "        id;comp;act;status;resp;msg;end;met;val".
            DISPLAY "HELP  : Mostra este menu".
            DISPLAY "EXIT  : Finaliza o programa".
            DISPLAY "================================".
            PERFORM WAIT-CMD.

         START-DB.
            MOVE "cobolbd"   TO   DBNAME
            ACCEPT USERNAME FROM ENVIRONMENT "DB_USER"
            ACCEPT PASSWD FROM ENVIRONMENT "DB_PASSWORD"
            
            EXEC SQL
               CONNECT :USERNAME IDENTIFIED BY :PASSWD USING :DBNAME 
            END-EXEC
            
            IF SQLCODE NOT = ZERO
               DISPLAY "0\STATUS"
               DISPLAY "#Erro ao conectar ao banco"
               DISPLAY "#SQLCODE: " SQLCODE
            ELSE
               MOVE "S" TO WS-DB-STARTED
               DISPLAY "1\STATUS"
               DISPLAY "#Conexao com o banco iniciada com sucesso"
            END-IF
            PERFORM WAIT-CMD.

         WAIT-CMD.
            DISPLAY "#Digite o comando: - Digite HELP para ajuda"
            ACCEPT WS-CMD
            
            IF WS-CMD = "START"
               IF WS-DB-STARTED = "S"
                  DISPLAY "1\STATUS"
                  DISPLAY "#Banco ja esta conectado"
                  PERFORM WAIT-CMD
               ELSE
                  PERFORM START-DB
               END-IF
            ELSE IF WS-CMD = "LOG"
               IF WS-DB-STARTED = "N"
                  DISPLAY "0\STATUS"
                  DISPLAY "#Banco nao conectado - Digite START primeiro"
                  PERFORM WAIT-CMD
               ELSE
                  PERFORM PROCESS-LOG
                  PERFORM WAIT-CMD
               END-IF
            ELSE IF WS-CMD = "HELP"
               PERFORM MENU-HELP
            ELSE IF WS-CMD = "EXIT" OR WS-CMD = "QUIT"
               PERFORM FIM-PROGRAMA
            ELSE
               DISPLAY "0\Comando invalido"
               DISPLAY "#Digite HELP para ajuda"
               PERFORM WAIT-CMD
            END-IF.

         PROCESS-LOG.
            DISPLAY "Digite dados do log (separados por ;):"
            ACCEPT WS-INPUT
            
            UNSTRING WS-INPUT DELIMITED BY ";"
                INTO WS-SESSION-ID
                     WS-COMPONENT
                     WS-ACTION
                     WS-STATUS
                     WS-RESPONSE-TIME
                     WS-MESSAGE
                     WS-ENDPOINT
                     WS-METHOD
                     WS-VALUE
            END-UNSTRING

            MOVE WS-RESPONSE-TIME TO WS-EDITED-RESPONSE
            MOVE WS-VALUE TO WS-EDITED-VALUE

      *    Normaliza dados removendo espaços em branco
           MOVE SPACES TO WS-NORM-SESSION-ID
           MOVE SPACES TO WS-NORM-COMPONENT
           MOVE SPACES TO WS-NORM-ACTION
           MOVE SPACES TO WS-NORM-STATUS
           MOVE SPACES TO WS-NORM-MESSAGE
           MOVE SPACES TO WS-NORM-ENDPOINT
           MOVE SPACES TO WS-NORM-METHOD
           
           PERFORM VARYING WS-IDX FROM 1 BY 1 
             UNTIL WS-SESSION-ID(WS-IDX:1) = SPACE
             OR WS-IDX > 10
               MOVE WS-SESSION-ID(WS-IDX:1) 
                 TO WS-NORM-SESSION-ID(WS-IDX:1)
           END-PERFORM
           
           PERFORM VARYING WS-IDX FROM 1 BY 1 
             UNTIL WS-COMPONENT(WS-IDX:1) = SPACE
             OR WS-IDX > 10
               MOVE WS-COMPONENT(WS-IDX:1) 
                 TO WS-NORM-COMPONENT(WS-IDX:1)
           END-PERFORM
           
           PERFORM VARYING WS-IDX FROM 1 BY 1 
             UNTIL WS-ACTION(WS-IDX:1) = SPACE
             OR WS-IDX > 20
               MOVE WS-ACTION(WS-IDX:1) 
                 TO WS-NORM-ACTION(WS-IDX:1)
           END-PERFORM
           
           PERFORM VARYING WS-IDX FROM 1 BY 1 
             UNTIL WS-STATUS(WS-IDX:1) = SPACE
             OR WS-IDX > 10
               MOVE WS-STATUS(WS-IDX:1) 
                 TO WS-NORM-STATUS(WS-IDX:1)
           END-PERFORM
           
           PERFORM VARYING WS-IDX FROM 1 BY 1 
             UNTIL WS-MESSAGE(WS-IDX:1) = SPACE
             OR WS-IDX > 100
               MOVE WS-MESSAGE(WS-IDX:1) 
                 TO WS-NORM-MESSAGE(WS-IDX:1)
           END-PERFORM
           
           PERFORM VARYING WS-IDX FROM 1 BY 1 
             UNTIL WS-ENDPOINT(WS-IDX:1) = SPACE
             OR WS-IDX > 50
               MOVE WS-ENDPOINT(WS-IDX:1) 
                 TO WS-NORM-ENDPOINT(WS-IDX:1)
           END-PERFORM
           
           PERFORM VARYING WS-IDX FROM 1 BY 1 
             UNTIL WS-METHOD(WS-IDX:1) = SPACE
             OR WS-IDX > 6
               MOVE WS-METHOD(WS-IDX:1) 
                 TO WS-NORM-METHOD(WS-IDX:1)
           END-PERFORM

            DISPLAY "log\" WS-SESSION-ID ";" WS-COMPONENT ";" 
                    WS-ACTION ";" WS-STATUS ";" WS-EDITED-RESPONSE ";"
                    WS-MESSAGE ";" WS-ENDPOINT ";" WS-METHOD ";"
                    WS-EDITED-VALUE

      *    Tenta inserir apenas na tabela de teste
            EXEC SQL
               INSERT INTO log_cobol_test 
               (session_id, response_time, value_processed,
               component, action, status, message, 
               endpoint, method, created_at)
               VALUES
               (:WS-NORM-SESSION-ID, :WS-RESPONSE-TIME, :WS-VALUE, 
               :WS-COMPONENT, :WS-ACTION, :WS-STATUS, :WS-MESSAGE, 
               :WS-ENDPOINT, :WS-METHOD, now())
            END-EXEC

            IF SQLCODE NOT = ZERO
               DISPLAY "0\DB_ERROR"
               DISPLAY "#Erro ao inserir log no banco"
               DISPLAY "#SQLCODE: " SQLCODE
               DISPLAY "#Dados inseridos:"
               DISPLAY "#  Session ID: " WS-NORM-SESSION-ID
               DISPLAY "#  Response:   " WS-RESPONSE-TIME
               DISPLAY "#  Value:      " WS-VALUE
            ELSE
               EXEC SQL
                  COMMIT
               END-EXEC
               IF SQLCODE NOT = ZERO
                  DISPLAY "0\DB_ERROR"
                  DISPLAY "#Erro ao confirmar inserção do log"
                  DISPLAY "#SQLCODE: " SQLCODE
               ELSE
                  DISPLAY "1\DB_SUCCESS"
                  DISPLAY "#Log inserido com sucesso"
               END-IF
            END-IF.

         FIM-PROGRAMA.
            IF WS-DB-STARTED = "S"
               EXEC SQL
                  DISCONNECT ALL
               END-EXEC
               DISPLAY "0\STATUS" 
               DISPLAY "#Conexao com o banco finalizada"
            END-IF
            
            STOP RUN. 