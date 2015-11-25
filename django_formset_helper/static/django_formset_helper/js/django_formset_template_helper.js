        // Templates
        var $hidden_field_template = $('<input type="hidden">'),
        $delete_button_template = $('<button class="btn btn-danger delete-item" type="button"><i class="fa fa-trash-o"></i></button>'),
        $edit_button_template = $('<button class="btn btn-info edit-item" type="button"><i class="fa fa-edit"></i></button>');

        // Get all fields inside form_id
        function get_form_fields(form_id){
            var count = 0,
                input_list = [];

            $("fieldset#"+form_id+"_fieldset :input").each(function(){
                var input = $(this);
                count ++;
                exclude = ["id_"+form_id+"-TOTAL_FORMS", "id_"+form_id+"-INITIAL_FORMS", "id_"+form_id+"-MAX_NUM_FORMS"];
                if($.inArray(input.context.id, exclude) == -1 ){
                    if(input.is(":hidden") == false){
                        input_list.push($('#'+input.context.id));
                    }
                }
            });
            return input_list;
        };

        // Delete button action - onClick
        $(document).on('click', '.delete-item', function(){
            var $this = $(this),
            $tr = $this.parent().parent(),
            $table = $this.parent().parent().parent().parent(),
            form_id = $table[0].id.replace("_table", "");
            $tr.hide().removeClass('form-row');
            $tr.find('input:hidden[name $= "-DELETE"]').val('True');

            handle_empty_table(form_id);
        });

        _is_editing = false;
        _editing_id = null;
        _editing_row = null;
        _edit_extras = [];

        // Edit button action - onClick
        $(document).on('click', '.edit-item', function(){
            var $this = $(this),
                $tr = $this.parent().parent(),
                $rows_actions = $(this).parent(),
                $table = $this.parent().parent().parent().parent(),
                formId = $table[0].id.replace("_table", ""),
                row = $this.closest('tr'),
                $form_dias_desconto = $('#'+formId+'_form'),
                formPrefix = '';

                editInputs = get_edit_inputs(row, formId); // campos do form na table
                fieldset = [],
                fieldset = $(get_form_fields(formId)); // campos do form

                i = 0;
                fieldset.each(function(){
                  if($(this).selector != '#'){
                    $(this).val(editInputs[i].val());
                  i++;
                  }; //end if
                }); //end fieldset.each

                // set True to _is_editing and its id
                _is_editing = true;
                _editing_id = editInputs[0].selector.split('-').slice(-2,-1);
                _editing_row = row;
                row.addClass("info");
        });

        function get_form_inputs_names(formId, formPrefix){
          var $formInputs = [],
              formInputsNames = [];

          $formInputs = $(get_form_fields(formId));
          $formInputs.each(function(){
            if(formPrefix != ''){
              if($(this).selector != '#'){
                formInputsNames.push($(this)[0].name.replace(formPrefix+'-', ''));
              }
            } else {
              if($(this).selector != '#'){
                formInputsNames.push($(this)[0].name);
              }
            }
          });
          return formInputsNames
        }

        function clear_edit_extras(){
          _edit_extras.length = 0;
        }

        function get_edit_inputs(row, formId){
            var count = 0,
                $row = row.find(':input'),
                input_list = [],
                formInputs = [],
                formPrefix = '';

            clear_edit_extras();

            formInputs = get_form_fields(formId);
            if (formInputs[0][0].name.split('-').length > 1){
              formPrefix = formInputs[0][0].name.split('-')[0];
            }
            formInputsNames = get_form_inputs_names(formId, formPrefix);

            $row.each(function(){
                var input = $(this),
                    button = false;
                count ++;
                if(input.context.type != 'button'){
                  $editInput = $('#'+input.context.id);
                } else {
                  button = true;
                  $editInput = input;

                }
                if(button == false){
                  name = $editInput[0].name.split('-')[$editInput[0].name.split('-').length-1];
                }
                if($.inArray(name, formInputsNames) >= 0){
                  input_list.push($editInput);
                } else {
                  _edit_extras.push($editInput);
                }
            });

            return input_list;
        }

        function add_line(form_id, required_fields, form_prefix){
            form_prefix = typeof form_prefix !== 'undefined' ? form_prefix : '';
            is_valid = formset_is_valid(required_fields)
            if (is_valid) {
              if(_is_editing){
                edit_row(form_id, form_prefix, _editing_row);
                limpa_formset(form_id);
              } else{
                add_row(form_id, form_prefix);
                limpa_formset(form_id);
              }
            }
        };


            // Renders the field going in the table row
            function render_field(field_name, field_value, form_id, form_prefix){
                var $field = $hidden_field_template.clone(),
                    field_name = field_name.replace(form_prefix+"-",""),
                    total_forms = $("#id_"+form_id+"-TOTAL_FORMS").val();
                $field.attr('id', 'id_'+form_id+'-' + total_forms + '-' + field_name);
                $field.attr('name', form_id+'-' + total_forms + '-' + field_name);
                $field.attr('value', field_value);
                return $field;
            }

            // Adds row with hidden fields and its display
            function add_row(form_id, form_prefix){
                var $tr = $('<tr class="form-row">'),
                input_list = [],
                input_list = $(get_form_fields(form_id));

                input_list.each(function(){
                    var input = $(this);
                    if(input.is("select")){
                        $tr.append($('<td>')
                            .append(input.find('option:selected').text())
                            .append(render_field(input.attr('name'), input.find('option:selected').val(), form_id, form_prefix)));
                    } else if(input.is("input")){
                        $tr.append($('<td>')
                            .append(input.val())
                            .append(render_field(input.attr('name'), input.val(), form_id, form_prefix)));
                    }
                });

                $tr.append($('<td>').addClass('action')
                    .append(render_field('id', '', form_id))
                    .append(render_field('DELETE', '', form_id))
                    .append($edit_button_template.clone())
                    // .append($edit_button_template.clone().addClass('edit-'+form_id))
                    .append($delete_button_template.clone()));

                $table = $('#'+form_id+'_table').find('tbody')
                $table.append($tr);
                $total_forms = $("#id_"+form_id+"-TOTAL_FORMS");
                $total_forms.val(+1 + Number($total_forms.val()))

                handle_empty_table(form_id);
            }

            // Edit the table row accordingly with the fieldset new values
            function edit_row(form_id, form_prefix, editingRow){
                    row = editingRow;

                    editInputs = get_edit_inputs(row, form_id);//form fields in the table
                    fieldset = [],
                    fieldset = $(get_form_fields(form_id)); // form fields
                    extras = $(_edit_extras); // extra form fields

                    i = 0;
                    fieldset.each(function(){
                      input = $(this);
                      if(i <= editInputs.length -1){
                        editInputs[i].val(input.val());
                        texto = '';

                        if(input.is("select")){
                          texto = input.find('option:selected').text();
                        } else if(input.is("input")){
                          texto = input.val();
                        }

                        col = editInputs[i].parent();
                        col.text(texto);
                        col.append(editInputs[i]);
                        i++;
                      }; // end if i<= length
                      extras.each(function(){
                        col.append($(this));
                      });
                    console.log(row.closest('.edit-item'));
                    }); // end fieldset.each



                    _is_editing = false;
                    _editing_id = null;
                    _editing_row = null;
                    row.removeClass("info");
            }

            // Check for form required fields
            function formset_is_valid(required_fields){
                var is_valid = true;
                    // verificando campos obrigatórios
                    $.each(required_fields, function(i, field){
                        if($(field).val().length == 0){
                            raise_error(field, 'error', 'Preenchimento Obrigatório');
                            is_valid = false;
                        }else{
                            remove_errors(field);
                        }
                    });


                    return is_valid;
                }


                // Handle the table after being empty
                function handle_empty_table(form_id){
               }


               // Clear the formset after adding the row
               function limpa_formset(form_id){
                   var formset = $('#'+form_id+'_form')
                   $select2 = $(formset).find('select'),
                   $inputs = $(formset).find(':input');


                   $select2.each(function(){
                    $(this).val('');
                    });

                   $inputs.each(function(){
                       $(this).val('');
                   });
               }

               // Raise error messages for each required field
               function raise_error(field, class_type,  error_message){
                   var $field = $(field),
                   $help_text = $("<div class='alert alert-danger'>")
                   .append($("<button type='button' class='close' data-dismiss='alert'>x</button>"))
                   .append($("<strong> Campo Obrigatório</strong>"))

                   remove_errors(field);

                   $field.closest('div.form-group')
                   .append($("<div class='row'>"))
                   .after($help_text);
               }

               // Remove previously raised error messages
               function remove_errors(field){
                  var $field = $(field);
                  $field.closest('div.form-group').parent()
                  .find('div.alert')
                  .remove();
              }
